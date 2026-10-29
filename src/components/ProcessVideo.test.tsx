import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ProcessVideo, {
  PROCESS_VIDEO_POSTER,
  PROCESS_VIDEO_SRC,
} from "./ProcessVideo";

type ObserverCallback = (entries: Array<{ isIntersecting: boolean }>) => void;
let observerCallback: ObserverCallback | null = null;
const observe = vi.fn();
const disconnect = vi.fn();

class FakeIntersectionObserver {
  constructor(callback: ObserverCallback) {
    observerCallback = callback;
  }
  observe = observe;
  disconnect = disconnect;
}

function mockReducedMotion(reduce: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockReturnValue({ matches: reduce } as MediaQueryList),
  );
}

beforeEach(() => {
  observerCallback = null;
  vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);
  vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(
    () => undefined,
  );
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

function getVideo() {
  return screen
    .getByRole("region", { name: /De la idea/ })
    .querySelector("video")!;
}

describe("ProcessVideo", () => {
  it("carga el vídeo de forma diferida, mudo y con controles", () => {
    mockReducedMotion(false);
    render(<ProcessVideo />);
    const video = getVideo();
    expect(video.getAttribute("src")).toBe(PROCESS_VIDEO_SRC);
    expect(video.getAttribute("poster")).toBe(PROCESS_VIDEO_POSTER);
    expect(video.getAttribute("preload")).toBe("none");
    expect(video.muted).toBe(true);
    expect(video.hasAttribute("controls")).toBe(true);
    expect(video).toHaveAccessibleDescription(/Requisitos, Propuesta/);
  });

  it("se reproduce solo mientras está a la vista", () => {
    mockReducedMotion(false);
    render(<ProcessVideo />);
    expect(observe).toHaveBeenCalledWith(getVideo());
    observerCallback?.([{ isIntersecting: true }]);
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1);
    observerCallback?.([{ isIntersecting: false }]);
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalledTimes(1);
  });

  it("no se reproduce solo si el visitante pide reducir el movimiento", () => {
    mockReducedMotion(true);
    render(<ProcessVideo />);
    expect(observerCallback).toBeNull();
    expect(observe).not.toHaveBeenCalled();
    expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
  });
});
