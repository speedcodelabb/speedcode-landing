import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SiteContentProvider } from "../context/SiteContentContext";
import { defaultSiteDocument } from "../lib/siteContent";
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

function renderProcessVideo() {
  return render(
    <SiteContentProvider document={defaultSiteDocument}>
      <ProcessVideo />
    </SiteContentProvider>,
  );
}

describe("ProcessVideo", () => {
  it("carga el vídeo de forma diferida, mudo y con controles", () => {
    mockReducedMotion(false);
    renderProcessVideo();
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
    renderProcessVideo();
    expect(observe).toHaveBeenCalledWith(getVideo());
    observerCallback?.([{ isIntersecting: true }]);
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1);
    observerCallback?.([{ isIntersecting: false }]);
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalledTimes(1);
  });

  it("no se reproduce solo si el visitante pide reducir el movimiento", () => {
    mockReducedMotion(true);
    renderProcessVideo();
    expect(observerCallback).toBeNull();
    expect(observe).not.toHaveBeenCalled();
    expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
  });

  it("muestra los compromisos configurados debajo del vídeo", () => {
    mockReducedMotion(true);
    renderProcessVideo();
    for (const item of defaultSiteDocument.commitments.items) {
      const heading = screen.getByRole("heading", { name: item.title });
      expect(heading).toBeInTheDocument();
      expect(screen.getByText(item.body)).toBeInTheDocument();
      expect(
        getVideo().compareDocumentPosition(heading) &
          Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy();
    }
  });
});
